import { startOfHour, parseISO, isBefore, format, subHours } from "date-fns";
import pt from "date-fns/locale/pt-BR";
import Mail from "../../lib/Mail";

import Appointment from "../models/Appointment";
import User from "../models/User";
import File from "../models/File";
import Notification from "../schemas/Notification";

class AppointmentController {
  async index(req, res) {
    const { page } = req.query;
    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null
      },
      order: ["date"],
      attributes: ["id", "date"],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: "provider",
          attributes: ["id", "name"],
          include: [
            { model: File, as: "avatar", attributes: ["id", "path", "url"] }
          ]
        }
      ]
    });

    return res.json(appointments);
  }
  async store(req, res) {
    const { provider_id, date } = req.body;

    const provider = await User.findOne({
      where: { id: provider_id, provider: true }
    });

    if (!provider) {
      return res
        .status(400)
        .json({ error: "Appointment is only with providers" });
    }

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: "Past date are not permitted" });
    }

    const checkAvailibility = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart
      }
    });

    if (checkAvailibility) {
      return res.status(400).json({ error: "Appointment is not available" });
    }

    const appointment = await Appointment.create({
      date: hourStart,
      user_id: req.userId,
      provider_id
    });

    const user = await User.findByPk(req.userId);

    /* Notifications */
    const formatedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', as' HH:mm'h'",
      pt
    );
    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formatedDate}`,
      user: provider_id
    });

    return res.json(appointment);
  }
  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [{ model: User, as: "provider", attributes: ["name", "email"] }]
    });

    if (appointment.user_id !== req.userId) {
      return res
        .status(400)
        .json({ error: "You dont have permission to cancel this appointment" });
    }

    const dateWithSub = subHours(appointment.date, 2);
    console.log(isBefore(dateWithSub, new Date()));
    if (isBefore(dateWithSub, new Date())) {
      return res
        .status(401)
        .json({ error: "You can only cancel appointments 2 hours in advance" });
    }

    appointment.canceled_at = new Date();
    appointment.save();

    /* Send mails when canceled appointment */
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: "Agendamento cancelado",
      text: "Tem um agendamento cancelado"
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
