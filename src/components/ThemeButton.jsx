import { useTheme } from "../hooks/useTheme.js";
import "../css/ThemeButton.css";

export default function ThemeButton({ className, onlyIcon}) {
    const { theme, toggleTheme } = useTheme();
    
    return (
        <button className={`theme-toggle ${className}`} onClick={toggleTheme}>
            {
                onlyIcon ? (
                    theme === "dark" ? ("🌞") : ("🌙")
                ) : (
                    theme === "dark" ? ("🌞 tema claro") : ("🌙 tema oscuro")
                )
            }
        </button>
    );
}