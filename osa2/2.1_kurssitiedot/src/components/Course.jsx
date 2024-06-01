const Course = ({ course }) => {
  const parts = course.parts
  const courseName = course.name
  
  const Header = ({ courseName }) => {
    console.log(courseName)
    return (
      <div>
        <h1>
          {courseName}
        </h1>
      </div>
    )
  }

  const Part = ({ part }) => {
    return (
      <li>{part.name} {part.exercises}</li>
    )
  }
  
  const Content = ({ parts }) => {
    console.log(parts)

    return (
      <div>
        <ul>
          {parts.map(part => 
            <Part key={part.id} part={part} />
          )}
        </ul>
      </div>
    )
  }
  return (
    <div>
      <Header course={courseName = courseName} />
      <Content parts={parts = parts} />
    </div>
  )

}

export default Course