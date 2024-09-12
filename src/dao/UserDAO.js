import User from '../models/User.js';
export default class UserDAO {
  async findById(id) {
    return await User.findById(id);
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async createUser(data) {
    console.log('Datos antes de crear el usuario:', data);

    const user = new User(data);
    const savedUser = await user.save();
    
    console.log('Usuario guardado en la base de datos:', savedUser);
    return savedUser;
  }
}
