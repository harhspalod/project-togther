import { db } from '../src/lib/db';
import { adminUsers, categories, products, customers, orders, orderItems, campaigns } from '../src/lib/db/schema';
import { hashPassword } from '../src/lib/auth';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Create admin user
    const hashedPassword = await hashPassword('password123');
    await db.insert(adminUsers).values({
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: hashedPassword,
      role: 'admin',
    });

    // Create categories
    const categoryData = [
      { name: 'Electronics', slug: 'electronics', description: 'Electronic devices and gadgets' },
      { name: 'Clothing', slug: 'clothing', description: 'Fashion and apparel' },
      { name: 'Books', slug: 'books', description: 'Books and literature' },
      { name: 'Home & Garden', slug: 'home-garden', description: 'Home improvement and gardening' },
    ];

    const insertedCategories = await db.insert(categories).values(categoryData).returning();

    // Create products
    const productData = [
      {
        name: 'Smartphone',
        description: 'Latest smartphone with advanced features',
        categoryId: insertedCategories[0].id,
        price: '699.99',
        salePrice: '599.99',
        stock: 50,
        sku: 'PHONE001',
        slug: 'smartphone',
        images: ['/temp/notification-img.jpg'],
      },
      {
        name: 'Laptop',
        description: 'High-performance laptop for work and gaming',
        categoryId: insertedCategories[0].id,
        price: '1299.99',
        salePrice: '1199.99',
        stock: 25,
        sku: 'LAPTOP001',
        slug: 'laptop',
        images: ['/temp/notification-img.jpg'],
      },
      {
        name: 'T-Shirt',
        description: 'Comfortable cotton t-shirt',
        categoryId: insertedCategories[1].id,
        price: '29.99',
        stock: 100,
        sku: 'SHIRT001',
        slug: 't-shirt',
        images: ['/temp/notification-img.jpg'],
      },
    ];

    const insertedProducts = await db.insert(products).values(productData).returning();

    // Create customers
    const customerData = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: '123 Main St, City, State',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1234567891',
        address: '456 Oak Ave, City, State',
      },
    ];

    const insertedCustomers = await db.insert(customers).values(customerData).returning();

    // Create sample orders
    const orderData = [
      {
        customerId: insertedCustomers[0].id,
        invoiceNo: 'INV-001',
        status: 'completed',
        paymentMethod: 'card',
        subtotal: '699.99',
        total: '699.99',
      },
      {
        customerId: insertedCustomers[1].id,
        invoiceNo: 'INV-002',
        status: 'pending',
        paymentMethod: 'cash',
        subtotal: '59.98',
        total: '59.98',
      },
    ];

    const insertedOrders = await db.insert(orders).values(orderData).returning();

    // Create order items
    await db.insert(orderItems).values([
      {
        orderId: insertedOrders[0].id,
        productId: insertedProducts[0].id,
        quantity: 1,
        price: '699.99',
        total: '699.99',
      },
      {
        orderId: insertedOrders[1].id,
        productId: insertedProducts[2].id,
        quantity: 2,
        price: '29.99',
        total: '59.98',
      },
    ]);

    // Create sample campaigns
    const campaignData = [
      {
        title: 'Bulk Purchase Discount',
        description: 'Get 10% off when you buy 5 or more items',
        discountType: 'percentage',
        discountValue: '10',
        conditionType: 'quantity',
        conditionValue: '5',
        couponCode: 'BULK10',
        isActive: true,
      },
      {
        title: 'High Spender Reward',
        description: 'Get $50 off when you spend $500 or more',
        discountType: 'fixed',
        discountValue: '50',
        conditionType: 'amount',
        conditionValue: '500',
        couponCode: 'SAVE50',
        isActive: true,
      },
    ];

    await db.insert(campaigns).values(campaignData);

    console.log('✅ Database seeded successfully!');
    console.log('📧 Admin login: admin@example.com');
    console.log('🔑 Password: password123');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});