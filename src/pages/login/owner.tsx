import Auth from "@components/Auth";

export default function OwnerLogin() {
    return (
        <div className="flex flex-col text-center">
            <Auth type="OWNER" />
        </div >
    )
}
