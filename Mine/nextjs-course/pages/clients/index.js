import Link from "next/link";

const ClientPage = () => {
    return (
        <div>
            <h1>고객 페이지</h1>
            <ul>
                <li>
                    <Link href='/clients/hi'>hi</Link>
                </li>
                <li>
                    <Link href='/clients/woosung'>woosung</Link>
                </li>
            </ul>
        </div>
    )
}

export default ClientPage;
