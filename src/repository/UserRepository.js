import UserDAO from '../dao/UserDAO.js';
export default class UserRepository {
  constructor() {
    this.userDAO = new UserDAO();
  }

  async findById(id) {
    return await this.userDAO.findById(id);
  }

  async findByEmail(email) {
    return await this.userDAO.findByEmail(email);
  }

  async createUser(data) {
    return await this.userDAO.createUser(data);
  }
}
