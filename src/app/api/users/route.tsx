import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken';
import { users } from '@/db/database';

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json()
        if (token) {
            // If the cookie exists, access its value
            const verify = await jwt.verify(token, 'zxcvbnmlkjhgfdsaqwertyuiop123456');

            if (typeof verify === 'object' && 'email' in verify) {
                const email = verify.email;
                const existUser = await users.findOne({ email: email });
                if (existUser) {
                    return NextResponse.json({ msg: 'successfully fetched data', users: existUser }, { status: 201 })
                }
            } else {
                return NextResponse.json({ msg: 'Invalid JWT payload' }, { status: 401 });
            }

        } else {
            return NextResponse.json({ msg: 'The "codemarket" cookie does not exist.' }, { status: 200 })
        }

    } catch (error) {
        console.log('Backend Server Error', error);
        return NextResponse.json({ msg: 'backend server error', error: error }, { status: 500 })
    }
}
