import TicketDAO from '../dao/TicketDAO.js';

export default class TicketRepository {
    constructor() {
        this.ticketDAO = new TicketDAO();
    }

    async createTicket(data) {
        return await this.ticketDAO.createTicket(data);
    }

    async findById(id) {
        return await this.ticketDAO.findById(id);
    }
}
