import { useState } from "react";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, FileText } from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useForm, router, Head } from "@inertiajs/react";

interface Article {
  id: number;
  title: string;
  description: string;
  article_order: number;
  status: "active" | "inactive";
}

interface SettingsContractArticlesProps {
  articles: Article[];
}

const SettingsContractArticles = ({ articles: initialArticles }: SettingsContractArticlesProps) => {
  const { toast } = useToast();
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingArticle, setDeletingArticle] = useState<Article | null>(null);

  const createForm = useForm({
    title: "",
    description: "",
    article_order: 0,
    status: "active",
  });

  const updateForm = useForm({
    title: "",
    description: "",
    article_order: 0,
    status: "active",
  });

  const openCreate = () => {
    setEditingArticle(null);
    createForm.setData({
      title: "",
      description: "",
      article_order: articles.length > 0 ? Math.max(...articles.map(a => a.article_order)) + 1 : 1,
      status: "active",
    });
    createForm.clearErrors();
    setDialogOpen(true);
  };

  const openEdit = (article: Article) => {
    setEditingArticle(article);
    updateForm.setData({
      title: article.title,
      description: article.description,
      article_order: article.article_order,
      status: article.status,
    });
    updateForm.clearErrors();
    setDialogOpen(true);
  };

  const openDelete = (article: Article) => {
    setDeletingArticle(article);
    setDeleteOpen(true);
  };

  const handleCreate = () => {
    createForm.post(route("settings.contract-articles.store"), {
      onSuccess: (page) => {
        setDialogOpen(false);
        createForm.reset();
        toast({ title: "Contract article created successfully" });
        setArticles(page.props.articles as Article[]);
      },
      onError: (errors) => {
        Object.entries(errors).forEach(([field, message]) => {
          toast({ title: message as string, variant: "destructive" });
        });
      },
    });
  };

  const handleUpdate = () => {
    if (!editingArticle) return;

    updateForm.put(route("settings.contract-articles.update", editingArticle.id), {
      onSuccess: (page) => {
        setDialogOpen(false);
        updateForm.reset();
        setEditingArticle(null);
        toast({ title: "Contract article updated successfully" });
        setArticles(page.props.articles as Article[]);
      },
      onError: (errors) => {
        Object.entries(errors).forEach(([field, message]) => {
          toast({ title: message as string, variant: "destructive" });
        });
      },
    });
  };

  const toggleStatus = (article: Article) => {
    router.patch(route("settings.contract-articles.toggle-status", article.id), {}, {
      onSuccess: (page) => {
        toast({ title: article.status === "active" ? "Article deactivated" : "Article activated" });
        setArticles(page.props.articles as Article[]);
      },
    });
  };

  const handleDelete = () => {
    if (!deletingArticle) return;

    router.delete(route("settings.contract-articles.destroy", deletingArticle.id), {
      onSuccess: (page) => {
        toast({ title: "Contract article deleted successfully" });
        setArticles(page.props.articles as Article[]);
        setDeleteOpen(false);
        setDeletingArticle(null);
      },
    });
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const list = [...articles];
    
    // Swap orders
    const temp = list[index].article_order;
    list[index].article_order = list[index - 1].article_order;
    list[index - 1].article_order = temp;

    // Sort to reflect UI swap immediately
    list.sort((a, b) => a.article_order - b.article_order);
    setArticles(list);

    submitReorder(list);
  };

  const handleMoveDown = (index: number) => {
    if (index === articles.length - 1) return;
    const list = [...articles];
    
    // Swap orders
    const temp = list[index].article_order;
    list[index].article_order = list[index + 1].article_order;
    list[index + 1].article_order = temp;

    // Sort to reflect UI swap immediately
    list.sort((a, b) => a.article_order - b.article_order);
    setArticles(list);

    submitReorder(list);
  };

  const submitReorder = (updatedList: Article[]) => {
    const orders = updatedList.map((a, idx) => ({
      id: a.id,
      article_order: idx + 1, // normalize orders to match their position
    }));

    router.post(route("settings.contract-articles.reorder"), { orders }, {
      onSuccess: (page) => {
        setArticles(page.props.articles as Article[]);
      },
    });
  };

  return (
    <SidebarProvider>
      <Head title="Contract Articles" />
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 bg-card border-b border-border flex items-center px-6 sticky top-0 z-40">
            <SidebarTrigger className="lg:hidden mr-4" />
            <AppBreadcrumb />
          </header>

          <main className="flex-1 p-6 lg:p-8 max-w-[1200px] animate-in fade-in slide-in-from-bottom-1 duration-400">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold">Contract Articles</h2>
                <p className="text-[0.9375rem] text-muted-foreground">Manage the order, content, and activation of clauses injected into generated PDFs.</p>
              </div>
              <Button onClick={openCreate} className="gap-2">
                <Plus className="w-4 h-4" /> New Article
              </Button>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] text-center">Order</TableHead>
                    <TableHead className="w-[200px]">Title</TableHead>
                    <TableHead>Content Preview</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="text-right w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.map((article, index) => (
                    <TableRow key={article.id} className={article.status === "inactive" ? "opacity-60" : ""}>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-mono font-bold w-6 text-center">{article.article_order}</span>
                          <div className="flex flex-col gap-0.5">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-5 w-5 rounded-sm p-0 hover:bg-muted" 
                              onClick={() => handleMoveUp(index)}
                              disabled={index === 0}
                            >
                              <ArrowUp className="w-3 h-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-5 w-5 rounded-sm p-0 hover:bg-muted" 
                              onClick={() => handleMoveDown(index)}
                              disabled={index === articles.length - 1}
                            >
                              <ArrowDown className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">{article.title}</TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground line-clamp-2 max-w-[500px]" dangerouslySetInnerHTML={{ __html: article.description }} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={article.status === "active" ? "default" : "outline"} className="text-xs">
                            {article.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                          <Switch
                            checked={article.status === "active"}
                            onCheckedChange={() => toggleStatus(article)}
                            className="scale-75"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(article)}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" 
                            onClick={() => openDelete(article)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {articles.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No articles configured. Click "New Article" to add one.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </main>
        </div>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {editingArticle ? "Edit Article" : "Create Contract Article"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 py-2 pr-1">
            <div>
              <Label>Title <span className="text-destructive">*</span></Label>
              <Input
                value={editingArticle ? updateForm.data.title : createForm.data.title}
                onChange={(e) => editingArticle
                  ? updateForm.setData("title", e.target.value)
                  : createForm.setData("title", e.target.value)
                }
                placeholder="e.g. ARTICLE 3"
              />
              {(editingArticle ? updateForm.errors.title : createForm.errors.title) && (
                <p className="text-sm text-destructive mt-1">
                  {editingArticle ? updateForm.errors.title : createForm.errors.title}
                </p>
              )}
            </div>

            <div>
              <Label>Description / Clause Content <span className="text-destructive">*</span></Label>
              <Textarea
                value={editingArticle ? updateForm.data.description : createForm.data.description}
                onChange={(e) => editingArticle
                  ? updateForm.setData("description", e.target.value)
                  : createForm.setData("description", e.target.value)
                }
                placeholder="Write the full contract clause here..."
                rows={10}
              />
              {(editingArticle ? updateForm.errors.description : createForm.errors.description) && (
                <p className="text-sm text-destructive mt-1">
                  {editingArticle ? updateForm.errors.description : createForm.errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Article Order <span className="text-destructive">*</span></Label>
                <Input
                  type="number"
                  value={editingArticle ? updateForm.data.article_order : createForm.data.article_order}
                  onChange={(e) => editingArticle
                    ? updateForm.setData("article_order", parseInt(e.target.value) || 0)
                    : createForm.setData("article_order", parseInt(e.target.value) || 0)
                  }
                />
                {(editingArticle ? updateForm.errors.article_order : createForm.errors.article_order) && (
                  <p className="text-sm text-destructive mt-1">
                    {editingArticle ? updateForm.errors.article_order : createForm.errors.article_order}
                  </p>
                )}
              </div>

              <div>
                <Label>Status</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={(editingArticle ? updateForm.data.status : createForm.data.status) === "active" ? "default" : "outline"}>
                    {(editingArticle ? updateForm.data.status : createForm.data.status) === "active" ? "Active" : "Inactive"}
                  </Badge>
                  <Switch
                    checked={(editingArticle ? updateForm.data.status : createForm.data.status) === "active"}
                    onCheckedChange={(checked) => {
                      const newStatus = checked ? "active" : "inactive";
                      if (editingArticle) {
                        updateForm.setData("status", newStatus);
                      } else {
                        createForm.setData("status", newStatus);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={editingArticle ? handleUpdate : handleCreate}
              disabled={editingArticle ? updateForm.processing : createForm.processing}
            >
              {editingArticle ? (updateForm.processing ? "Saving..." : "Save Changes") : (createForm.processing ? "Creating..." : "Create Article")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete contract article?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deletingArticle?.title}</strong>? This clause will be permanently removed from all future generated PDFs. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};

export default SettingsContractArticles;
