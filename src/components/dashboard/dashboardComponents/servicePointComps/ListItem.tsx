import React from 'react'
import '../../../common/css/form.css'

export interface ListItemProp<T,> {
    index: number,
    item: T;
    displayText: string
    edit: (item: T) => void
    activate: (item: T) => void;
}

export const ListItem = <T,>({ index, item, displayText, edit, activate, }: ListItemProp<T>) => {
    return (
        <div className='from-question-item flex between centerV'>
            Question {index}: {displayText}
            <div className='form-button-holder'>
                <button onClick={() => { activate(item) }}>Activate</button>
                <button onClick={() => { edit(item) }}>Edit</button>
            </div>
        </div>

    )
}