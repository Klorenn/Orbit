import { I } from './Icons';
import { who, catOf, navTo } from '../data/constants';
import { AmbassadorAvatar } from './AmbassadorAvatar';
import { Vote } from './Vote';
import { CategoryBadge } from './CategoryBadge';

export function PostCard({ post, onVote }) {
  const u = who(post.author);
  return (
    <a className="post" href={'#/forum/' + post.cat + '/' + post.id}>
      <Vote count={post.upvotes} voted={post.upvoted} onToggle={() => onVote(post.id)} />
      <div className="post-main">
        <div className="post-tags">
          <span className="tag type">{post.type}</span>
          <CategoryBadge cat={post.cat} soft />
          <span className="cid" title="Pinned to IPFS / Filecoin">◈ {post.cidStr}</span>
        </div>
        <h3 className="pt">{post.title}</h3>
        <p className="excerpt">{post.excerpt}</p>
        <div className="post-meta">
          <span className="who">
            <AmbassadorAvatar user={post.author} link={false} />
            <span className="nm">{u.name}</span>
          </span>
          {u.role && <span className="role">{u.role}</span>}
          <span className="dotsep"></span>
          <span>{u.city}</span>
          <span className="dotsep"></span>
          <span>{post.time} ago</span>
          <span className="dotsep"></span>
          <span className="cmtcount">{I.cmt()} {post.comments.length}</span>
        </div>
      </div>
    </a>
  );
}
