import { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Search, Radio, Clock, ArrowRight, ArrowUpRight } from "lucide-react";

export default function News() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await axios.get("/api/news");
        setNews(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredNews = news.filter(n => n.title?.toLowerCase().includes(search.toLowerCase()) || n.source_id?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      
      {/* Hero Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 z-0"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <Badge variant="outline" className="text-blue-400 border-blue-500/30 mb-6 py-1 px-3 bg-blue-950">
            <Radio className="w-3 h-3 mr-2 text-blue-400 animate-pulse" /> Live Intelligence Feed
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">Crypto Intelligence</h1>
          <p className="text-slate-400 text-lg mb-8">Breaking news, market insights & exchange updates — curated in real time.</p>
          
          <div className="relative max-w-xl mx-auto shadow-2xl">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search stories, topics, keywords…" 
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl py-4 pl-12 pr-12 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder:text-slate-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <span className="text-xs font-mono text-slate-500 border border-slate-700 bg-slate-800 px-1.5 py-0.5 rounded">⌘K</span>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
           {[...Array(6)].map((_, i) => (
             <div key={i} className="h-80 bg-muted/60 animate-pulse rounded-2xl border"></div>
           ))}
        </div>
      ) : filteredNews.length > 0 ? (
        <>
          {/* Featured Article */}
          {!search && news[0] && (
            <div className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col md:flex-row cursor-pointer" onClick={() => window.open(news[0].link, '_blank')}>
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-center relative z-10 order-2 md:order-1">
                <Badge variant="secondary" className="w-max mb-4 bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">
                  <StarIcon className="w-3 h-3 mr-1" /> Featured Story
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 group-hover:text-blue-600 transition-colors leading-snug">{news[0].title}</h2>
                <p className="text-muted-foreground mb-6 line-clamp-3 text-sm md:text-base leading-relaxed">{news[0].description}</p>
                <div className="flex items-center gap-4 text-sm font-medium mt-auto text-slate-500">
                  <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md text-slate-700"><div className="w-2 h-2 rounded-full bg-blue-500"></div> {news[0].source_id}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {news[0].pubDate?.substring(0, 10)}</span>
                  <span className="flex items-center gap-1 ml-auto text-blue-600 font-bold group-hover:underline">Read story <ArrowRight className="w-4 h-4" /></span>
                </div>
              </div>
              <div className="md:w-[40%] bg-muted order-1 md:order-2 overflow-hidden relative min-h-[250px] md:min-h-full">
                {news[0].image_url ? (
                  <img src={news[0].image_url} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-slate-800 flex items-center justify-center text-slate-600"><Radio className="w-12 h-12" /></div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 py-4">
            <h3 className="font-bold text-lg text-slate-800">Latest Stories</h3>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(search ? filteredNews : news.slice(1)).map((article, idx) => (
              <a href={article.link} target="_blank" rel="noopener noreferrer" key={idx} className="bg-card border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-slate-300 transition-all group flex flex-col h-full">
                 <div className="relative h-[200px] overflow-hidden bg-slate-100">
                   {article.image_url ? (
                     <img src={article.image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-800"><Radio className="w-10 h-10" /></div>
                   )}
                 </div>
                 <div className="p-5 flex flex-col flex-1">
                   <div className="mb-3">
                     <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-widest"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> {article.source_id}</span>
                   </div>
                   <h3 className="font-bold text-[17px] leading-snug mb-3 line-clamp-3 group-hover:text-blue-600 transition-colors">{article.title}</h3>
                   <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-4">{article.description}</p>
                   <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                     <span className="text-xs font-semibold text-slate-400">{article.pubDate?.substring(0, 10)}</span>
                     <span className="text-xs font-bold text-blue-600 flex items-center gap-1">Read <ArrowUpRight className="w-3.5 h-3.5" /></span>
                   </div>
                 </div>
              </a>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-card border border-dashed rounded-2xl">
          <Search className="w-12 h-12 text-slate-200 mb-4" />
          <h3 className="text-lg font-bold text-slate-700">No stories match your search.</h3>
          <p className="text-slate-500">Try different keywords or clear the search.</p>
        </div>
      )}
    </div>
  );
}

function StarIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  );
}

