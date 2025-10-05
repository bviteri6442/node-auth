import { Validators } from "../../../config";




export class LoginUserDto {
constructor(
    public email: string,
    public password: string,
) {}

static create (object: {[key: string]: any; }): [ string | undefined, LoginUserDto | undefined]{
        const {email, password} = object;

        if (!email ) return ['Email is required', undefined];
        if (!Validators.email.test(email)) return ['Invalid email format', undefined];
        if (!password ) return ['Password is required', undefined];
        if (password.length < 6 ) return ['Password must be at least 6 characters long', undefined];



        return [undefined, new LoginUserDto(email, password)];
    }

}


