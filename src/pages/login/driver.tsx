import Auth from "@components/Auth";

export default function DriverLogin() {
    return (
        <div className="flex flex-col text-center">
            <Auth type="DRIVER" />
        </div >
    )
}
