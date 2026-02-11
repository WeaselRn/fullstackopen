const Person = ({ person, onDelete }) => {
    return (
        <p>
            {person.name} {person.number}
            <button onClick={() => onDelete(person.id)}>
                delete
            </button>
        </p>
    )
}

export default Person
