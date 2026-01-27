import { type NewUser, newUserSchema } from "@shared/types/user.types";
import { useMutation } from "@tanstack/react-query";
import { produce } from "immer";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import S from "./style/Register.style";

type AllNullable<T> = { [K in keyof T]: T[K] | null };

export default function Register() {
	const [user, setUser] = useState<AllNullable<NewUser>>({
		username: null,
		password: null,
		email: null,
	});
	const { mutate } = useMutation(trpc.auth.register.mutationOptions());

	useEffect(() => {
		console.log({ user });
	}, [user]);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setUser(
			produce((draft) => {
				const name = e.target.name as keyof typeof user;
				draft[name] = e.target.value;
			})
		);
	}

	const handleSubmit = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			try {
				e.preventDefault();
				const validatedUser = newUserSchema.parse(user);
				mutate(validatedUser);
			} catch (error) {
				// TODO: remove this trycatch, or capture a Sentry error
				console.log({ error });
			}
		},
		[user]
	);

	return (
		<S.Form onSubmit={handleSubmit}>
			<S.Label>
				username:
				<input type="text" name="username" onChange={handleChange} />
			</S.Label>

			<S.Label>
				password:
				<input type="text" name="password" onChange={handleChange} />
			</S.Label>

			<S.Label>
				email:
				<input type="email" name="email" onChange={handleChange} />
			</S.Label>

			<button type="submit">Register</button>
		</S.Form>
	);
}
