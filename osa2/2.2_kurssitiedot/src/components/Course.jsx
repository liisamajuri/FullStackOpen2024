const Header = ({ courseName }) => {
  console.log(courseName)
  return (
    <h1>{courseName}</h1>
  )
}

const Part = ({ part }) => {
  console.log(part)
  return (
    <p>{part.name} {part.exercises}</p>
  )
}

const Content = ({ parts }) => {
  console.log(parts)
  return (
    <div>
      {parts.map(part => 
        <Part key={part.id} part={part} />
      )}
    </div>
  )
}

const Total = ({ parts }) => {
  const exeriseList = Array()
  
  parts.map((part) => exeriseList.push(part.exercises));

  console.log(exeriseList)

  const initialValue = 0;
  const sum = exeriseList.reduce(
    (accumulator, currentValue) => accumulator + currentValue, initialValue,
  );

  console.log(sum);
  
  return (
    <b>Total of {sum} exercises</b>
  )
}

  const Course = ({ course }) => {
  return (
    <div>
      <Header courseName = {course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )

}

export default Course