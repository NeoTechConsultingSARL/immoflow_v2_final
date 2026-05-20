import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
import { User, Mail, Phone, Building2, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ClientFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: any;
  onSuccess?: () => void;
}

const typeOptions = [
  { value: "individual", label: "Individual" },
  { value: "company", label: "Company" },
  { value: "lead", label: "Lead" },
  { value: "prospect", label: "Prospect" },
  { value: "owner", label: "Owner" },
];

const ClientFormModal = ({ open, onOpenChange, client, onSuccess }: ClientFormModalProps) => {
  const isEditing = !!client;

  const { data, setData, post, put, processing, errors, reset, setData: setFormData } = useForm({
    full_name: client?.full_name || "",
    email: client?.email || "",
    phone: client?.phone || "",
    identity_number: client?.identity_number || "",
    address: client?.address || "",
    type: client?.type || "individual",
  });

  // Update form data when client changes
  useEffect(() => {
    if (client) {
      setFormData('full_name', client.full_name || "");
      setFormData('email', client.email || "");
      setFormData('phone', client.phone || "");
      setFormData('identity_number', client.identity_number || "");
      setFormData('address', client.address || "");
      setFormData('type', client.type || "individual");
    }
  }, [client]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      put(route('clients.update', client.id), {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess?.();
          reset();
        },
      });
    } else {
      post(route('clients.store'), {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess?.();
          reset();
        },
      });
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Client" : "Create New Client"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update client information and contact details." : "Add a new client to your directory."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name *
              </Label>
              <Input
                id="full_name"
                type="text"
                value={data.full_name}
                onChange={(e) => setData('full_name', e.target.value)}
                placeholder="John Doe"
                className={errors.full_name ? 'border-red-500' : ''}
              />
              {errors.full_name && (
                <p className="text-sm text-red-500">{errors.full_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Client Type *</Label>
              <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select client type" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="john@example.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
                placeholder="+1 234 567 8900"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="identity_number" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Identity Number (CIN/Passport)
            </Label>
            <Input
              id="identity_number"
              type="text"
              value={data.identity_number}
              onChange={(e) => setData('identity_number', e.target.value)}
              placeholder="AB123456"
              className={errors.identity_number ? 'border-red-500' : ''}
            />
            {errors.identity_number && (
              <p className="text-sm text-red-500">{errors.identity_number}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Address
            </Label>
            <Textarea
              id="address"
              value={data.address}
              onChange={(e) => setData('address', e.target.value)}
              placeholder="123 Main Street, City, Country"
              rows={3}
              className={errors.address ? 'border-red-500' : ''}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={processing} style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
              {processing ? 'Saving...' : (isEditing ? 'Update Client' : 'Create Client')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientFormModal;
