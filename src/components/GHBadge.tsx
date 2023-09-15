import { Badge, NavLink } from "react-bootstrap";
import { BsGithub } from "react-icons/bs";

export default function GHBadge() {
  return (
    <Badge id="ghBadge">
      <NavLink about="Fork me!" href="https://github.com/garhul/toolbox">
        <BsGithub />
        <span>Fork me!</span>
      </NavLink>
    </Badge>
  );
}