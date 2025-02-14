"use server"

import SuccessMessage from "@/components/ui/SuccessMessage"
import getToken from "@/src/auth/token"
import { ErrorResponseSchema, SuccessSchema, userInformationSchema } from "@/src/schemas"
import { revalidatePath } from "next/cache"

type ActionProps = {
    errors: string[],
    success: string
}

export async function updateUserInformation(prevState:ActionProps, formData: FormData) {

    const userInformation = userInformationSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email")
    })

    if(!userInformation.success){
        return {
            errors: userInformation.error.issues.map(issue => issue.message),
            success: ""
        }
    }

    const token = getToken();
    const url = `${process.env.API_URL}/auth/user`;

    const req = await fetch(url, {
        method:"PUT",
        headers:{
            'Content-Type':'application/json',
            'Authorization': ` Bearer ${token}`
        },
        body: JSON.stringify({
            name: userInformation.data.name,
            email: userInformation.data.email
        })
    })

    const json = await req.json();

    if(!req.ok){
        const {error} = ErrorResponseSchema.parse(json);

        return {
            errors: [error],
            success: ""
        }
    }

    revalidatePath("/admin/profile/settings");
    const success = SuccessSchema.parse(json);

    return {
        errors:[],
        success
    }
}