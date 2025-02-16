const Button = ({ children, className, style, onClick, type = "button", ...props }) => {
    // เพิ่ม base styles และ merge กับ className ที่ส่งเข้ามา
    const baseStyles = "transition-colors duration-200";
    
    const handleClick = (e) => {
        if (onClick) {
            onClick(e);
        }
    };

    return (
        <button 
            className={`${baseStyles} ${className}`}
            style={style}
            type={type}
            onClick={handleClick}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;
