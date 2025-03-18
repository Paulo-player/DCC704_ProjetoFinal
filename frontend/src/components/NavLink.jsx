import { Link } from "react-router-dom";

const NavLink = ({ to, text }) => {
  return <Link to={to}>{text}</Link>;
};

export default NavLink;
