type ScheduleItem = {
  date: Date[];
};

type BookingFormProps = {
  _id: string;
  model: string;
  schedule: ScheduleItem[];
  price: number | string;
};


const BookingForm = ({ _id, model, schedule, price }: BookingFormProps) => {
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-bold">Car Model: {model}</h2>
      <p><strong>ID:</strong> {_id}</p>
      <p><strong>Price From:</strong> ${price}</p>

      <h3 className="mt-4 font-semibold">Schedule:</h3>
      {schedule.length > 0 ? (
        schedule.map((s, i) => (
          <div key={i} className="mb-2">
            <ul className="list-disc list-inside">
              {s.date.map((d, idx) => (
                <li key={idx}>{d.toDateString()}</li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No schedule available</p>
      )}
    </div>
  );
};

export default BookingForm;
