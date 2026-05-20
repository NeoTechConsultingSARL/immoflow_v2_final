import { useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from 'axios';

interface ContractFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companies: any[];
  clients: any[];
  contract?: any;
  onSuccess?: () => void;
  bloc?: any;
}

const ContractFormModal = ({ open, onOpenChange, companies, clients, contract, onSuccess, bloc }: ContractFormModalProps) => {
  const isEditing = !!contract;

  const { data, setData, post, put, processing, errors, reset, setData: setFormData } = useForm({
    client_id: contract?.client_id?.toString() || "",
    property_id: contract?.property_id?.toString() || "",
    status: contract?.status || "active",
    price: contract?.price || "",
    date: contract?.date || "",
    // temporary states for cascading
    company_id: contract?.property?.bloc?.tranche?.project?.company_id?.toString() || bloc?.tranche?.project?.company_id?.toString() || "",
    project_id: contract?.property?.bloc?.tranche?.project_id?.toString() || bloc?.tranche?.project_id?.toString() || "",
    tranche_id: contract?.property?.bloc?.tranche_id?.toString() || bloc?.tranche_id?.toString() || "",
    bloc_id: contract?.property?.bloc_id?.toString() || bloc?.id?.toString() || "",
  });

  // Update form data when contract changes
  useEffect(() => {
    if (contract) {
      setFormData('client_id', contract.client_id?.toString() || "");
      setFormData('property_id', contract.property_id?.toString() || "");
      setFormData('status', contract.status || "active");
      setFormData('price', contract.price || "");
      setFormData('date', contract.date || "");
      setFormData('company_id', contract?.property?.bloc?.tranche?.project?.company_id?.toString() || "");
      setFormData('project_id', contract?.property?.bloc?.tranche?.project_id?.toString() || "");
      setFormData('tranche_id', contract?.property?.bloc?.tranche_id?.toString() || "");
      setFormData('bloc_id', contract?.property?.bloc_id?.toString() || "");
    }
  }, [contract]);

  const [projects, setProjects] = useState<any[]>([]);
  const [tranches, setTranches] = useState<any[]>([]);
  const [blocs, setBlocs] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);

  // Cascading logic
  useEffect(() => {
    if (data.company_id) {
      axios.get(route('api.companies.projects', data.company_id)).then(res => setProjects(res.data));
    } else {
      setProjects([]);
    }
  }, [data.company_id]);

  useEffect(() => {
    if (data.project_id) {
      axios.get(route('api.projects.tranches', data.project_id)).then(res => setTranches(res.data));
    } else {
      setTranches([]);
    }
  }, [data.project_id]);

  useEffect(() => {
    if (data.tranche_id) {
      axios.get(route('api.tranches.blocs', data.tranche_id)).then(res => setBlocs(res.data));
    } else {
      setBlocs([]);
    }
  }, [data.tranche_id]);

  useEffect(() => {
    if (data.bloc_id) {
      axios.get(route('api.blocs.properties', data.bloc_id)).then(res => setProperties(res.data));
    } else {
      setProperties([]);
    }
  }, [data.bloc_id]);

  // Initial load for editing
  useEffect(() => {
    if (isEditing && contract && open) {
      const companyId = contract?.property?.bloc?.tranche?.project?.company_id?.toString();
      const projectId = contract?.property?.bloc?.tranche?.project_id?.toString();
      const trancheId = contract?.property?.bloc?.tranche_id?.toString();
      const blocId = contract?.property?.bloc_id?.toString();

      const loadCascadingData = async () => {
        if (companyId) {
          const res = await axios.get(route('api.companies.projects', companyId));
          setProjects(res.data);
        }
        if (projectId) {
          const res = await axios.get(route('api.projects.tranches', projectId));
          setTranches(res.data);
        }
        if (trancheId) {
          const res = await axios.get(route('api.tranches.blocs', trancheId));
          setBlocs(res.data);
        }
        if (blocId) {
          const res = await axios.get(route('api.blocs.properties', blocId));
          setProperties(res.data);
        }
      };

      loadCascadingData();
    }
  }, [isEditing, contract, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      put(route('blocs.contracts.update', [bloc.id, contract.id]), {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess?.();
          reset();
        },
      });
    } else {
      post(route('blocs.contracts.store', bloc.id), {
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
    setProjects([]);
    setTranches([]);
    setBlocs([]);
    setProperties([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Contract" : "Create Contract"}</DialogTitle>
          <DialogDescription>
            Link a client to a property with this contract.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Client Information</h3>
            <div className="grid gap-2">
              <Label>Client *</Label>
              <Select value={data.client_id} onValueChange={v => setData("client_id", v)}>
                <SelectTrigger><SelectValue placeholder="Select Client" /></SelectTrigger>
                <SelectContent>
                  {clients.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.full_name} ({c.identity_number})</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.client_id && <p className="text-xs text-destructive">{errors.client_id}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Property Selection</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Company</Label>
                <Select value={data.company_id} onValueChange={v => { setData(d => ({...d, company_id: v, project_id: "", tranche_id: "", bloc_id: "", property_id: ""})) }}>
                  <SelectTrigger><SelectValue placeholder="Select Company" /></SelectTrigger>
                  <SelectContent>
                    {companies.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Project</Label>
                <Select disabled={!data.company_id} value={data.project_id} onValueChange={v => setData(d => ({...d, project_id: v, tranche_id: "", bloc_id: "", property_id: ""}))}>
                  <SelectTrigger><SelectValue placeholder="Select Project" /></SelectTrigger>
                  <SelectContent>
                    {projects.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Tranche</Label>
                <Select disabled={!data.project_id} value={data.tranche_id} onValueChange={v => setData(d => ({...d, tranche_id: v, bloc_id: "", property_id: ""}))}>
                  <SelectTrigger><SelectValue placeholder="Select Tranche" /></SelectTrigger>
                  <SelectContent>
                    {tranches.map(t => <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Bloc</Label>
                <Select disabled={!data.tranche_id} value={data.bloc_id} onValueChange={v => setData(d => ({...d, bloc_id: v, property_id: ""}))}>
                  <SelectTrigger><SelectValue placeholder="Select Bloc" /></SelectTrigger>
                  <SelectContent>
                    {blocs.map(b => <SelectItem key={b.id} value={b.id.toString()}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2 mt-4">
              <Label>Property (Unit) *</Label>
              <Select disabled={!data.bloc_id} value={data.property_id} onValueChange={v => setData("property_id", v)}>
                <SelectTrigger className="border-primary/50"><SelectValue placeholder="Select Property Unit" /></SelectTrigger>
                <SelectContent>
                  {properties.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name} - €{p.price} ({p.status})</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.property_id && <p className="text-xs text-destructive">{errors.property_id}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Contract Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={data.status} onValueChange={v => setData("status", v)}>
                  <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active (Reserves Property)</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-xs text-destructive">{errors.status}</p>}
              </div>
              <div className="grid gap-2">
                <Label>Date</Label>
                <Input type="date" value={data.date} onChange={e => setData("date", e.target.value)} />
                {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
              </div>
              <div className="grid gap-2 col-span-2">
                <Label>Agreed Price (€)</Label>
                <Input type="number" step="0.01" value={data.price} onChange={e => setData("price", e.target.value)} placeholder="0.00" />
                {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={processing} style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
              {isEditing ? "Update Contract" : "Create Contract"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContractFormModal;
