import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const VerifyUser: React.FC = () => {
  const { token } = useParams<{ token: string }>(); // Extract the token from the URL
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const { data } = await axios.get(`/api/v1/auth/verify-user/${token}`);
        if (data.success) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Something went wrong ");
      } finally {
        setLoading(false);
        navigate("/sign-in");
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p>Verification complete. You can now proceed.</p>
      )}
    </div>
  );
};

export default VerifyUser;
