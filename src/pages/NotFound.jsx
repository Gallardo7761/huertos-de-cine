import ContentWrapper from "@/components/ContentWrapper";
import CustomContainer from "@/components/CustomContainer";
import '@/css/NotFound.css';
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <ContentWrapper>
            <CustomContainer>
                <h1 className="text-center not-found">404</h1>
                <h2 className="text-center">Página no encontrada</h2>
                <Link to="/">
                    <p className="text-center">Volver al inicio</p>
                </Link>
            </CustomContainer>
        </ContentWrapper>
    );
}

export default NotFound;