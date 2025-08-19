import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// Zod schema
const MemberSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, 'Name is required'),
    age: z.string().min(1, 'Age is required'), // keeping as string for simplicity
})

const TeamCreationSchema = z.object({
    members: z.array(MemberSchema).min(1, 'At least one member is required'),
})

type Member = z.infer<typeof MemberSchema>
type FormData = z.infer<typeof TeamCreationSchema>

export const ObjTest = () => {
    const {
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(TeamCreationSchema),
        defaultValues: { members: [] },
    })

    const members = watch('members') || []

    const [inputName, setInputName] = useState('')
    const [inputAge, setInputAge] = useState('')

    const handleAddMember = () => {
        const trimmedName = inputName.trim()
        const trimmedAge = inputAge.trim()

        // Optional: show basic validation here too
        if (!trimmedName || !trimmedAge) return

        const newMember: Member = {
            id: Date.now(),
            name: trimmedName,
            age: trimmedAge,
        }

        setValue('members', [...members, newMember], {
            shouldValidate: true,
            shouldDirty: true,
        })

        setInputName('')
        setInputAge('')
    }

    const onSubmit = (data: FormData) => {
        console.log('✅ Validated Team Members:', data.members)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input
                type="text"
                placeholder="Name"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Age"
                value={inputAge}
                onChange={(e) => setInputAge(e.target.value)}
            />
            <button type="button" onClick={handleAddMember}>
                Add Member
            </button>

            {errors.members && (
                <p style={{ color: 'red' }}>{errors.members.message}</p>
            )}

            <div>
                {members.map((member, index) => (
                    <p key={member.id ?? index}>
                        {member.name} ({member.age})
                        {errors.members?.[index]?.name && (
                            <span style={{ color: 'red' }}> - {errors.members[index]!.name!.message}</span>
                        )}
                        {errors.members?.[index]?.age && (
                            <span style={{ color: 'red' }}> - {errors.members[index]!.age!.message}</span>
                        )}
                    </p>
                ))}
            </div>

            <button type="submit">Submit All</button>
        </form>
    )
}
