
import Link from "next/link";
import Container from "../container";
import { useAuthStore } from "@/store";
import AuthActions from "./components";






const Header =  () => {

    return (
        <Container>
            <div className="flex justify-between items-center bg-primary p-3 px-5 text-white rounded-md ">
                <Link href="/" className="text-[2rem]">
                    TX
                </Link>
                <div>

                </div>
                <div className="">
                    <AuthActions />
                </div>
            </div>
        </Container>
    )
}

export default Header;