import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class UserSeeder extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: 'password',
        role: 'admin',
      },
      {
        fullName: 'Regular User',
        email: 'user@example.com',
        password: 'password',
        role: 'regular',
      }
    ])
  }
}