import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface LayoutProps {
    children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="layout-wrapper">
            <Header/>
            <main className="layout-content">{children}</main>
            <Footer/>
        </div>
    )
}