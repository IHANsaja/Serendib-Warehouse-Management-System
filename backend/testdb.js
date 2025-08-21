const db = require('./config/db');

async function testDatabase() {
  try {
    console.log('Testing database connection and data...');
    
    // Test basic connection
    const [rows] = await db.query('SELECT 1 as test');
    console.log('✅ Database connection successful:', rows[0]);
    
    // Check ORDER table structure
    const [orderStructure] = await db.query('DESCRIBE `ORDER`');
    console.log('✅ ORDER table structure:', orderStructure);
    
    // Check all orders
    const [allOrders] = await db.query('SELECT * FROM `ORDER`');
    console.log('✅ All orders in database:', allOrders);
    console.log('✅ Total orders:', allOrders.length);
    
    // Check orders by type
    const [loadingOrders] = await db.query("SELECT * FROM `ORDER` WHERE Type = 'loading'");
    console.log('✅ Loading orders:', loadingOrders);
    console.log('✅ Loading orders count:', loadingOrders.length);
    
    const [unloadingOrders] = await db.query("SELECT * FROM `ORDER` WHERE Type = 'unloading'");
    console.log('✅ Unloading orders:', unloadingOrders);
    console.log('✅ Unloading orders count:', unloadingOrders.length);
    
    // Check COMPANY table
    const [companies] = await db.query('SELECT * FROM COMPANY');
    console.log('✅ Companies in database:', companies);
    console.log('✅ Total companies:', companies.length);
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    process.exit(0);
  }
}

testDatabase();