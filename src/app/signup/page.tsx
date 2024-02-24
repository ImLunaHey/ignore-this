'use client';

/* eslint-disable react/no-children-prop */
import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import type { FieldApi } from '@tanstack/react-form';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Box } from '@/components/box';

const FieldInfo = ({ field }: { field: FieldApi<any, any, any, any> }) => {
  return (
    <span className="h-10">
      {field.state.meta.touchedErrors}
      {field.state.meta.isValidating && 'Validating...'}
    </span>
  );
};

const Form = () => {
  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value);
    },
  });

  return (
    <Box>
      <form.Provider>
        <form
          className="flex flex-col items-center justify-between gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <div className="flex flex-row gap-2">
            {/* A type-safe field component*/}
            <form.Field
              name="username"
              validators={{
                onChange: ({ value }) => {
                  return !value
                    ? 'A username is required'
                    : value.length < 3
                    ? 'Your username must be at least 3 characters'
                    : undefined;
                },
                onChangeAsyncDebounceMs: 500,
                onChangeAsync: async ({ value }) => {
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                  return value.includes('error') && 'No "error" allowed in username';
                },
              }}
              children={(field) => {
                return (
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2">
                      <label htmlFor={field.name}>{field.name}:</label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="text-zinc-800 bg-[#ededed] rounded-sm p-2 w-48"
                      />
                    </div>
                    <FieldInfo field={field} />
                  </div>
                );
              }}
            />
          </div>
          <div className="flex flex-row gap-2">
            <form.Field
              name="password"
              children={(field) => (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row gap-2">
                    <label htmlFor={field.name}>{field.name}:</label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      type="password"
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="text-zinc-800 bg-[#ededed] rounded-sm p-2 w-48"
                    />
                  </div>
                  <FieldInfo field={field} />
                </div>
              )}
            />
          </div>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting ? '...' : 'Submit'}
              </Button>
            )}
          />
        </form>
      </form.Provider>
    </Box>
  );
};

export default function Signin() {
  return (
    <main className="flex flex-col min-h-[100dvh] items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-center">Sign up</h1>
      <Form />
    </main>
  );
}
