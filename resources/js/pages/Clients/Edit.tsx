import Create from './Create';

interface EditProps {
  client: {
    id: number;
    full_name: string;
    email: string | null;
    phone: string | null;
    identity_number: string | null;
    address: string | null;
    type: string;
  };
}

const Edit = ({ client }: EditProps) => {
  return <Create client={client} />;
};

export default Edit;
