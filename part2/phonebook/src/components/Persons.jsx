import Person from './Person'

const Persons = ({ persons, onDelete }) => {
    return (
        <div>
            {persons
                .filter(person => person)   // skip undefined
                .map(person => (
                    <Person
                        key={person.id}
                        person={person}
                        onDelete={onDelete}
                    />
                ))}
        </div>
    )
}


export default Persons
