import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

type ButtonAnswer = {
    buttonText: string;
};

type FormValues = {
    buttonAnswers: ButtonAnswer[];
};

export default function ButtonAdder() {
    const { control, handleSubmit, register } = useForm<FormValues>({
        defaultValues: {
            buttonAnswers: [], // ආරම්භයේ empty array එකක්
        },
    });

    // useFieldArray වලට control එක සහ name දෙන්න
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'buttonAnswers',
    });

    const [inputValue, setInputValue] = useState('');

    const onSubmit = (data: FormValues) => {
        console.log('Form data:', data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label>Add a Button Answer:</label>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button
                    type="button"
                    onClick={() => {
                        if (inputValue.trim()) {
                            append({ buttonText: inputValue.trim() });
                            setInputValue('');
                        }
                    }}
                >
                    Add +
                </button>
            </div>

            <div>
                {fields.map((field, index) => (
                    <div key={field.id} style={{ marginTop: '10px' }}>
                        <input
                            {...register(`buttonAnswers.${index}.buttonText` as const)}
                            defaultValue={field.buttonText}
                        />
                        <button type="button" onClick={() => remove(index)}>
                            Remove x
                        </button>
                    </div>
                ))}
            </div>

            <button type="submit">Submit Form</button>
        </form>
    );
}
