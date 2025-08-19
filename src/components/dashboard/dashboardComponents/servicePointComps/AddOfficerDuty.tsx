import { Duty } from '../../../../types/Duty';
import { DutyState } from '../../../../types/DutyState';
import { UserDto } from '../../../../types/UserDto';
import { RightAlign } from '../../../common/RightAlign';
import { useSearchUser } from '../../../customHooks/useSearchUser';
import { DisplayVisitOptions } from '../../../frontOfficePage/DisplayOptionPage';
import { DutySchemaType } from '../AddServicePoint';
import { PersonItem } from './PersonItem';

export interface OfficerDutyProps {
    close: () => void;
    dutyList: DutySchemaType[],
    appendDuty: (duty: DutySchemaType) => void,
    removeDuty: (index: number) => void,
}

export const AddOfficerDuty = ({ close, dutyList, appendDuty, removeDuty, }: OfficerDutyProps) => {
    const { users, setUsers, input, setInput, } = useSearchUser();

    const addToDutyList = (user: UserDto) => {
        const duty: DutySchemaType = {
            id: 0,
            officer: user,
            dutyState: "PENDING",
            AcceptedTime: ''
        }
        if (!dutyList.some(duty => duty.officer.id == user.id)) {
            appendDuty(duty)
        }
        else {
            console.log("already inclued")
        }

    }

    const isAdded = (user: UserDto): boolean => {
        return dutyList.some(d => d.officer.id == user.id)
    }

    return (
        <div>
            {dutyList.length > 0 && <h4 className='m-4'>Already added officers</h4>}
            {dutyList.length > 0 &&
                dutyList.map((d, index) =>
                    <div key={index} className='m-3 flex centerV w-75 justify-content-between'>
                        <PersonItem user={d.officer as UserDto}></PersonItem>
                        <button onClick={() => removeDuty(index)} key={index} className='outline_button'>Remove</button>
                    </div>

                )}
            <div className="form-group w-75 m-3">
                <label className="form-label">Officer Name :</label>
                <input className='form-input' placeholder='Search Officer by using name email or id' type="text" value={input} onChange={(e) => setInput(e.target.value)} />
            </div>
            {users.length > 0 ? users.map(u => <div className='m-3 flex centerV w-75 justify-content-between' onClick={() => addToDutyList(u)} key={u.id}><PersonItem user={u}></PersonItem> <button className='outline_button'>{isAdded(u) ? 'Added' : 'Add To the List'}</button></div>)
                :
                <h3 className='text-center m-5'>No Users Found</h3>}

            <RightAlign>
                <button onClick={close} className='form-button m-5'>Save and Close</button>
            </RightAlign>
        </div>
    )
}
