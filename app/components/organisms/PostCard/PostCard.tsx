import Link from "next/link";

type PostProps = {
    title: string;
    uri: string;
};

type PostCardProps = {
    post: PostProps;
};

export default function PostCard({ post }: PostCardProps) {
    const cleanedUri = post.uri.trim().replace(/^\/+|\/+$/g, '');
    return (
        <Link href={`/blogs/${cleanedUri}`} className="card p-2" passHref>
            <h3>{post.title} &rarr;</h3>
        </Link>
    )
}
