import { useEffect, useMemo, useState } from "react";
import Icon from "./icons.jsx";
import { formatDate, getHighlights, getSectionCount, parseMaterial } from "./material.js";

const lessons = window.GREEK_COURSE_LESSONS || [];
const assetBaseUrl = import.meta.env.BASE_URL || "/";

function encodeAsset(assetPath) {
  return assetPath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function assetUrl(assetPath) {
  return `${assetBaseUrl}${encodeAsset(assetPath)}`;
}

function LessonCard({ lesson, active, material, onSelect }) {
  const count = material ? getSectionCount(material) : null;

  return (
    <button className={`lesson-card ${active ? "is-active" : ""}`} onClick={() => onSelect(lesson.id)}>
      <span className="lesson-card__date">{formatDate(lesson.date)}</span>
      <strong>{lesson.title}</strong>
      <span className="lesson-card__meta">
        {lesson.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </span>
      <span className="lesson-card__footer">
        <span>{count ? `${count} review items` : "Ready to load"}</span>
        <Icon name="arrow" />
      </span>
    </button>
  );
}

function Overview({ activeLesson, material }) {
  const highlights = material ? getHighlights(material) : [];

  return (
    <>
      <section className="hero">
        <div className="hero__copy">
          <span className="eyebrow">Greek review workspace</span>
          <h1>Turn every lesson into a fast, visual study session.</h1>
          <p>
            Browse your dated course materials, revisit vocabulary and grammar blocks, and keep exercises beside the
            notes they belong to.
          </p>
        </div>
        <div className="stats-strip" aria-label="Course stats">
          <div>
            <strong>{lessons.length}</strong>
            <span>Lesson{lessons.length === 1 ? "" : "s"}</span>
          </div>
          <div>
            <strong>{activeLesson?.exercises?.length || 0}</strong>
            <span>Exercise file{activeLesson?.exercises?.length === 1 ? "" : "s"}</span>
          </div>
          <div>
            <strong>{activeLesson?.links?.length || 0}</strong>
            <span>Practice link{activeLesson?.links?.length === 1 ? "" : "s"}</span>
          </div>
        </div>
      </section>
      <section className="highlight-band">
        <div>
          <span className="eyebrow">Current focus</span>
          <h2>{activeLesson?.title || "No lesson selected"}</h2>
        </div>
        <div className="quick-terms">
          {highlights.length ? (
            highlights.map((item) => (
              <span title={item.raw} key={item.raw}>
                <b>{item.greek}</b>
                {item.meaning ? <small>{item.meaning}</small> : null}
              </span>
            ))
          ) : (
            <span>
              <b>Loading</b>
              <small>material</small>
            </span>
          )}
        </div>
      </section>
    </>
  );
}

function ImageOverview({ images, onExpand }) {
  if (!images?.length) return null;

  return (
    <section className="image-overview">
      <div className="section-heading">
        <span>
          <Icon name="image" />
        </span>
        <h3>Visual Overview</h3>
        <small>
          {images.length} image{images.length === 1 ? "" : "s"}
        </small>
      </div>
      <div className="image-grid">
        {images.map((image) => (
          <button className="image-card" key={image.path} onClick={() => onExpand(image)} title="View full size">
            <img src={assetUrl(image.path)} alt={image.title} />
            <span>{image.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function StudySection({ section }) {
  return (
    <section className="study-section">
      <div className="section-heading">
        <span>
          <Icon name={section.label.includes("Article") ? "grid" : "book"} />
        </span>
        <h3>{section.label}</h3>
        <small>{section.lines.length} items</small>
      </div>
      <div className="study-grid">
        {section.lines.map((line) => (
          <article className={`study-item ${line.type === "note" ? "study-item--note" : ""}`} key={line.raw}>
            <div className="study-item__greek">{line.greek}</div>
            {line.meaning ? <div className="study-item__meaning">{line.meaning}</div> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function ResourceLinks({ links }) {
  if (!links?.length) return null;

  return (
    <section className="resource-panel">
      <div className="section-heading">
        <span>
          <Icon name="video" />
        </span>
        <h3>Practice Videos</h3>
        <small>{links.length} links</small>
      </div>
      <div className="resource-grid">
        {links.map((link) => (
          <a className="resource-card" href={link.url} key={link.url} target="_blank" rel="noreferrer">
            <span className="resource-card__source">{link.source}</span>
            <strong>{link.title}</strong>
            <span className="resource-card__focus">{link.focus}</span>
            <span className="resource-card__action">
              Watch <Icon name="external" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function Exercises({ exercises }) {
  if (!exercises?.length) return null;

  return (
    <section className="exercise-panel">
      <div className="section-heading">
        <span>
          <Icon name="file" />
        </span>
        <h3>Exercises</h3>
        <small>{exercises.length} files</small>
      </div>
      <div className="exercise-grid">
        {exercises.map((exercise) => {
          const path = assetUrl(exercise.path);

          return (
            <article className="exercise-card" key={exercise.path}>
              <div>
                <strong>{exercise.title}</strong>
                <span>{exercise.type.toUpperCase()}</span>
              </div>
              <a href={path} target="_blank" rel="noreferrer">
                Open <Icon name="arrow" />
              </a>
              <object data={path} type="application/pdf">
                <p>PDF preview unavailable. Use the open link above.</p>
              </object>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ImageLightbox({ image, onClose }) {
  useEffect(() => {
    if (!image) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [image, onClose]);

  if (!image) return null;

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={image.title} onClick={onClose}>
      <div className="lightbox__panel" onClick={(event) => event.stopPropagation()}>
        <button className="icon-button lightbox__close" onClick={onClose} title="Close" aria-label="Close image">
          <Icon name="close" />
        </button>
        <img src={assetUrl(image.path)} alt={image.title} />
        <div className="lightbox__caption">{image.title}</div>
      </div>
    </div>
  );
}

function LessonDetail({ lesson, material, loading, error, onExpandImage }) {
  if (error) return <div className="empty-state">I could not load this lesson: {error}</div>;
  if (loading || !material) return <div className="empty-state">Loading {lesson.title}...</div>;

  return (
    <main className="lesson-detail">
      <div className="lesson-title-row">
        <div>
          <span className="eyebrow">{formatDate(lesson.date)}</span>
          <h2>{lesson.title}</h2>
        </div>
        <div className="tag-row">
          {lesson.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
      <ImageOverview images={lesson.images} onExpand={onExpandImage} />
      <ResourceLinks links={lesson.links || []} />
      {material.map((section) => (
        <StudySection section={section} key={section.label} />
      ))}
      <Exercises exercises={lesson.exercises || []} />
    </main>
  );
}

export default function App() {
  const lessonsById = useMemo(() => new Map(lessons.map((lesson) => [lesson.id, lesson])), []);
  const [activeLessonId, setActiveLessonId] = useState(() => {
    const hashId = window.location.hash.replace("#", "");
    return lessonsById.has(hashId) ? hashId : lessons[0]?.id || null;
  });
  const [materials, setMaterials] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const [expandedImage, setExpandedImage] = useState(null);

  const activeLesson = lessonsById.get(activeLessonId) || lessons[0];
  const activeMaterial = activeLesson ? materials[activeLesson.id] : null;

  useEffect(() => {
    if (!activeLesson || materials[activeLesson.id] || loading[activeLesson.id]) return;

    setLoading((current) => ({ ...current, [activeLesson.id]: true }));

    fetch(assetUrl(activeLesson.material))
      .then((response) => {
        if (!response.ok) throw new Error(`Could not load ${activeLesson.material}`);
        return response.text();
      })
      .then((text) => {
        setMaterials((current) => ({ ...current, [activeLesson.id]: parseMaterial(text) }));
      })
      .catch((error) => {
        setErrors((current) => ({ ...current, [activeLesson.id]: error.message }));
      })
      .finally(() => {
        setLoading((current) => ({ ...current, [activeLesson.id]: false }));
      });
  }, [activeLesson, loading, materials]);

  function selectLesson(id) {
    setActiveLessonId(id);
    window.history.replaceState(null, "", `#${id}`);
  }

  return (
    <>
      <div className="shell">
        <Overview activeLesson={activeLesson} material={activeMaterial} />
        <div className="workspace">
          <aside className="sidebar">
            <div className="sidebar__header">
              <Icon name="search" />
              <strong>Lessons</strong>
            </div>
            <div className="lesson-list">
              {lessons.map((lesson) => (
                <LessonCard
                  active={lesson.id === activeLesson?.id}
                  key={lesson.id}
                  lesson={lesson}
                  material={materials[lesson.id]}
                  onSelect={selectLesson}
                />
              ))}
            </div>
          </aside>
          {activeLesson ? (
            <LessonDetail
              error={errors[activeLesson.id]}
              lesson={activeLesson}
              loading={loading[activeLesson.id]}
              material={activeMaterial}
              onExpandImage={setExpandedImage}
            />
          ) : (
            <div className="empty-state">Add a dated lesson folder to begin.</div>
          )}
        </div>
      </div>
      <ImageLightbox image={expandedImage} onClose={() => setExpandedImage(null)} />
    </>
  );
}
