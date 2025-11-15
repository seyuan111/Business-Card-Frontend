import { Link, useNavigate } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';

const BackButton = ({
  destination = '/Home',
  fallback = '/get-cards', // alternative target to jump straight to card list
}) => {
  const navigate = useNavigate();

  const handleBack = (event) => {
    event.preventDefault();
    // Try browser back first so users return to where they came from.
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    // If no history stack, prefer cards list if provided, otherwise the destination.
    if (fallback) {
      navigate(fallback);
      return;
    }
    navigate(destination);
  };

  return (
    <div className="flex">
      <Link
        to={destination}
        onClick={handleBack}
        className="bg-sky-800 text-white px-2 py-1 rounded-lg w-fit"
      >
        <BsArrowLeft className="text-2xl" />
      </Link>
    </div>
  );
};

export default BackButton;
