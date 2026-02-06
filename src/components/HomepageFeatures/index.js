import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '系统化的测试教程',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        从功能测试到自动化测试，从接口测试到性能测试，
        为你提供循序渐进的学习路径，助你快速入门软件测试领域。
      </>
    ),
  },
  {
    title: '实战驱动学习',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        结合真实项目案例讲解测试技术，分享企业级测试方案与最佳实践，
        让你学以致用，快速提升职场竞争力。
      </>
    ),
  },
  {
    title: '持续更新迭代',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        紧跟测试技术发展趋势，持续更新内容涵盖 AI 测试、云测试等前沿领域，
        与测试工程师共同成长，打造高质量的学习社区。
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
