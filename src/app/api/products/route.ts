import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, categories } from '@/lib/db/schema';
import { eq, desc, ilike, or } from 'drizzle-orm';
import { z } from 'zod';

const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.number(),
  price: z.string(),
  salePrice: z.string().optional(),
  stock: z.number().default(0),
  sku: z.string().optional(),
  status: z.enum(['selling', 'out-of-stock']).default('selling'),
  published: z.boolean().default(true),
  images: z.array(z.string()).default([]),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '10');
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId');

    const offset = (page - 1) * perPage;

    let whereConditions = [];
    
    if (search) {
      whereConditions.push(
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.description, `%${search}%`)
        )
      );
    }

    if (categoryId) {
      whereConditions.push(eq(products.categoryId, parseInt(categoryId)));
    }

    const allProducts = await db.query.products.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      with: {
        category: true,
      },
      orderBy: [desc(products.createdAt)],
      limit: perPage,
      offset,
    });

    // Get total count for pagination
    const totalCount = await db.$count(products, 
      whereConditions.length > 0 ? and(...whereConditions) : undefined
    );

    const totalPages = Math.ceil(totalCount / perPage);

    return NextResponse.json({
      data: allProducts,
      pagination: {
        page,
        perPage,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createProductSchema.parse(body);

    // Generate slug from name
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newProduct = await db.insert(products).values({
      ...data,
      slug,
    }).returning();

    return NextResponse.json(newProduct[0], { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}