import Ticket from '../models/Ticket.js';

export default class TicketDAO {
    async createTicket(data) {
        const ticket = new Ticket(data);
        return await ticket.save();
    }

    async findById(id) {
        return await Ticket.findById(id);
    }
}
