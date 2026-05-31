import { I } from './Icons';
import { who } from '../data/constants';
import { AmbassadorAvatar } from './AmbassadorAvatar';
import { Vote } from './Vote';
import { CategoryBadge } from './CategoryBadge';
import { BookmarkBtn } from './BookmarkBtn';

export function PostCard({ post, onVote }) {
  const u = who(post.author);
  const commentCount = Array.isArray(post.comments) ? post.comments.length : 0;
  return (
    <a className="post" href={'#/forum/' + post.cat + '/' + post.id}>
      <Vote count={post.upvotes} voted={post.upvoted} onToggle={() => onVote(post.id)} />
      <div className="post-main">
        <div className="post-tags">
          <span className="tag type">{post.type}</span>
          <CategoryBadge cat={post.cat} soft />
          {post.cidStr && <span className="cid" title="Pinned to IPFS / Filecoin">◈ {post.cidStr}</span>}
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
          {post.time && <><span className="dotsep"></span><span>{post.time} ago</span></>}
          <span className="dotsep"></span>
          <span className="cmtcount">{I.cmt()} {commentCount}</span>
          <span className="post-actions" onClick={e => e.preventDefault()}>
            <BookmarkBtn id={post.id} compact />
          </span>
        </div>
      </div>
    </a>
  );
}
