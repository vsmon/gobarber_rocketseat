const {
  host_email: host,
  port_email: port,
  user_email: user,
  pass_email: pass
} = process.env;

export default {
  host,
  port,
  secure: false,
  auth: {
    user,
    pass
  },
  default: {
    from: "Equipe GoBarber <noreply@gobarber.com>"
  }
};
