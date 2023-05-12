import { useState } from "react";
import pb from "lib/pocketbase";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, Grid, Typography, TextField } from "@mui/material";

export default function Auth() {
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [dummyState, setDummyState] = useState(0);
  const isLoggedIn = pb.authStore.isValid;

  async function login(data) {
    setIsLoading(true);
    try {
      const authData = await pb
        .collection("users")
        .authWithPassword(data.email, data.password);
    } catch (err) {
      console.error(err);
    }

    setIsLoading(false);
  }

  function logout() {
    pb.authStore.clear();
    setDummyState(Math.random());
  }

  if (isLoggedIn)
    return (
      <>
        <Typography>
          Logged in: {isLoggedIn && pb.authStore.model.email}
        </Typography>
        <Button variant="contained" onClick={logout}>
          Wyloguj
        </Button>
      </>
    );

  return (
    <>
      <Typography>Zaloguj się</Typography>
      {isLoading && <p>Loading...</p>}

      <form onSubmit={handleSubmit(login)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Controller
              name="email"
              placeholder="email"
              {...register("email")}
              autoComplete="off"
              control={control}
              render={({ field }) => <TextField {...field} />}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="password"
              placeholder="password"
              {...register("password")}
              autoComplete="off"
              control={control}
              render={({ field }) => <TextField type="password" {...field} />}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" type="submit" disabled={isLoading}>
              {isLoading ? "Ładuję" : "Zaloguj"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
