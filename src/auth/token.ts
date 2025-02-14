import { cookies } from "next/headers";



export default function getToken() {
    const token = cookies().get('CASHTRAKR_TOKEN')?.value;
    return token

}
