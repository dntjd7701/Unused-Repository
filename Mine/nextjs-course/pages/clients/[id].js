import { useRouter } from 'next/router';

const ClientDynamicPage = () => {
    const router = useRouter();
    console.debug('router:', router)
    return (
        <div>
            <h1>{router.query.id}</h1>
        </div>
    )
}
export default ClientDynamicPage;