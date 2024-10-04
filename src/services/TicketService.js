import TicketRepository from '../repository/TicketRepository.js';
import TicketDTO from '../dto/TicketDTO.js';

export default class TicketService {
    constructor() {
        this.ticketRepository = new TicketRepository();
    }

    async createTicket(data) {
        const ticket = await this.ticketRepository.createTicket(data);
        return new TicketDTO(ticket);
    }
}
