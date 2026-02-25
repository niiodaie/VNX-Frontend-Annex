import { db } from './server/db';
import { mentors, journeySteps, inspirationItems, collaborations, challenges } from './shared/schema';

async function resetDatabase() {
  try {
    console.log('Starting database reset...');
    
    // Reset tables in reverse order to avoid foreign key constraints
    console.log('Dropping challenges table...');
    await db.delete(challenges);
    
    console.log('Dropping collaborations table...');
    await db.delete(collaborations);
    
    console.log('Dropping inspiration items table...');
    await db.delete(inspirationItems);
    
    console.log('Dropping journey steps table...');
    await db.delete(journeySteps);
    
    console.log('Dropping mentors table...');
    await db.delete(mentors);
    
    console.log('Database reset completed successfully.');
    
    console.log('Now you can run the seed script to repopulate the database with the new mentor data.');
    console.log('Run: node server/seed-db.ts');
  } catch (error) {
    console.error('Error resetting database:', error);
  } finally {
    process.exit(0);
  }
}

// Run the reset function
resetDatabase();