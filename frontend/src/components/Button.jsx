const Button = ({ text, onClick, type = "submit" }) => {
    return <button type={type} onClick={onClick}>{text}</button>;
  };
  
  export default Button;
  