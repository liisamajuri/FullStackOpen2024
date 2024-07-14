const Header = ({ courseName }) => {
  console.log(courseName)
  return (
    <h2>{courseName}</h2>
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

  const calculateSum = (total, value) => {
    console.log(`total ${total}`)
    console.log(`value ${value}`)
    return total + value;
  }  

  const initialValue = 0;
  const sum = exeriseList.reduce(calculateSum, initialValue);

  console.log(sum);
  
  return (
    <p><b>Total of {sum} exercises</b></p>
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

const Courses = ({ courses }) => {
  return (
  
    <div>
      <h1>Web Development Curriculum</h1>
      {courses.map(course => 
        <Course key={course.id} course={course} />
      )}
    </div>
  );
};

export default Courses