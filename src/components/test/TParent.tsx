import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import './test.css'
import { SpecificDateAdder } from "../dashboard/dashboardComponents/visitOptions/smallComp/SpecificDateAdder";


// Define the Zod schema with superRefine for cross-field validation
const schema = z
    .object({
        name: z.string().min(1, "Name is required"),
        isPreRegistration: z.boolean(),
        preRegType: z.enum(["0", "1", "2", "3"]),
    })
    .superRefine((data, ctx) => {
        if (data.isPreRegistration && data.preRegType === "0") {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["preRegType"],
                message: "Please select a valid pre-registration type",
            });
        }
    });

// Infer the TypeScript type from the schema
type FormValues = z.infer<typeof schema>;

export const TParent = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [finalDates, setFinalDates] = useState<string[]>([])

    // Initialize react-hook-form with Zod resolveraaaaa
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            isPreRegistration: false,
            preRegType: "0",
        },
    });

    // Watch the isPreRegistration field
    const isPreRegistration = watch("isPreRegistration");

    // Handle form submission
    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate API call
            console.log("Form data:", data);
        } catch (error) {
            setSubmitError("Failed to submit the form. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="form">
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        aria-describedby={errors.name ? "name-error" : undefined}
                        {...register("name")}
                    />
                    {errors.name && (
                        <p id="name-error" className="error">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="isPreRegistration">
                        <input
                            type="checkbox"
                            id="isPreRegistration"
                            {...register("isPreRegistration")}
                        />
                        Is Pre-Registration
                    </label>
                </div>

                {isPreRegistration && (
                    <div>
                        <label htmlFor="preRegType">Select Pre-Registration Type</label>
                        <select
                            id="preRegType"
                            aria-describedby={errors.preRegType ? "preRegType-error" : undefined}
                            {...register("preRegType")}
                        >
                            <option value="0">-- Select --</option>
                            <option value="1">Pre Type 1</option>
                            <option value="2">Pre Type 2</option>
                            <option value="3">Pre Type 3</option>
                        </select>
                        {errors.preRegType && (
                            <p id="preRegType-error" className="error">
                                {errors.preRegType.message}
                            </p>
                        )}
                    </div>
                )}

                {submitError && <p className="error">{submitError}</p>}

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                </button>

            </form>
            <hr></hr>
            <SpecificDateAdder finalDates={finalDates} setFinalDates={setFinalDates} />
            <hr />
            <button>Final Submit</button>
        </>
    );
};
